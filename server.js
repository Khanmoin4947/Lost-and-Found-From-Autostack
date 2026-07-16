const express = require('express');
const cors = require('cors');
const multer = require('multer');
require('dotenv').config();
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, addDoc, serverTimestamp } = require('firebase/firestore');

// Initialize Express App
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
// Serve the frontend statically from the current directory
app.use(express.static(__dirname));

// Firebase Configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

const firebaseConfigured = Object.values(firebaseConfig).every(Boolean);
const itemsCol = firebaseConfigured
  ? collection(getFirestore(initializeApp(firebaseConfig)), 'items')
  : null;

// Cloudinary Unsigned Upload Credentials
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET;

async function uploadImageUnsigned(buffer, originalname) {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
    throw new Error('Image uploads are not configured');
  }

  const formData = new FormData();
  const blob = new Blob([buffer]);
  formData.append("file", blob, originalname);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!response.ok) {
    throw new Error('Failed to upload image to Cloudinary');
  }

  const data = await response.json();
  return data.secure_url;
}

// Multer setup for handling file uploads in memory
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, callback) => {
    callback(null, ['image/jpeg', 'image/png'].includes(file.mimetype));
  }
});

function requireFirebase(req, res, next) {
  if (!itemsCol) {
    return res.status(503).json({
      error: 'The item service is not configured. Add Firebase settings to .env.'
    });
  }
  next();
}

function validateItem(item) {
  const requiredFields = ['status', 'title', 'category', 'description', 'date', 'location', 'contactName'];
  const missingField = requiredFields.find((field) => !item[field]?.trim());
  if (missingField) return `${missingField} is required`;
  if (!['lost', 'found'].includes(item.status)) return 'status must be lost or found';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(item.date)) return 'date must use YYYY-MM-DD';
  if (item.contactEmail && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(item.contactEmail)) {
    return 'contactEmail must be a valid email address';
  }
  if (!item.contactEmail && !item.contactPhone) return 'an email address or phone number is required';
  return null;
}

// --- Routes ---

// GET /api/items - Fetch all items from Firestore
app.get('/api/items', requireFirebase, async (req, res) => {
  try {
    const snapshot = await getDocs(itemsCol);
    const items = snapshot.docs.map(doc => {
      const data = doc.data();
      // Firestore Timestamps can break JSON serialization, so we omit createdAt or turn it into a date string/number
      if (data.createdAt && typeof data.createdAt.toDate === 'function') {
        data.createdAt = data.createdAt.toDate().toISOString();
      }
      return { id: doc.id, ...data };
    });
    
    // Send items to frontend sorted locally if necessary, or just as is
    res.json(items);
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ error: "Failed to fetch items" });
  }
});

// POST /api/items - Create a new item
app.post('/api/items', requireFirebase, upload.single('image'), async (req, res) => {
  try {
    const {
      status, title, category, description, date,
      location, contactName, contactEmail, contactPhone
    } = req.body;

    const newItem = {
      status: status?.trim() || '',
      title: title?.trim() || '',
      category: category?.trim() || '',
      description: description?.trim() || '',
      date: date?.trim() || '',
      location: location?.trim() || '',
      contactName: contactName?.trim() || '',
      contactEmail: contactEmail?.trim() || '',
      contactPhone: contactPhone?.trim() || '',
      imageUrl: ''
    };

    const validationError = validateItem(newItem);
    if (validationError) return res.status(400).json({ error: validationError });

    if (req.file) {
      newItem.imageUrl = await uploadImageUnsigned(req.file.buffer, req.file.originalname);
    }

    const docRef = await addDoc(itemsCol, {
      ...newItem,
      createdAt: serverTimestamp()
    });

    newItem.id = docRef.id;

    res.status(201).json(newItem);
  } catch (error) {
    console.error("Error saving item:", error);
    res.status(500).json({ error: "Failed to save item" });
  }
});

app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'Image files must be 5 MB or smaller' });
  }
  if (error) {
    console.error('Unexpected request error:', error);
    return res.status(500).json({ error: 'Unexpected server error' });
  }
  next();
});

// Start Server
app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
