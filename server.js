const express = require('express');
const cors = require('cors');
const multer = require('multer');
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
  apiKey: "API_KEY",
  authDomain: "lost-and-found-7203c.firebaseapp.com",
  projectId: "lost-and-found-7203c",
  storageBucket: "lost-and-found-7203c.firebasestorage.app",
  messagingSenderId: "300041676634",
  appId: "1:300041676634:web:505fbb7b5991ff2358b563"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const itemsCol = collection(db, "items");

// Cloudinary Unsigned Upload Credentials
const CLOUDINARY_CLOUD_NAME = "dltwp5ioc";
const CLOUDINARY_UPLOAD_PRESET = "finditbymoin";

async function uploadImageUnsigned(buffer, originalname) {
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
const upload = multer({ storage: multer.memoryStorage() });

// --- Routes ---

// GET /api/items - Fetch all items from Firestore
app.get('/api/items', async (req, res) => {
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
app.post('/api/items', upload.single('image'), async (req, res) => {
  try {
    const {
      status, title, category, description, date,
      location, contactName, contactEmail, contactPhone
    } = req.body;

    let imageUrl = "";

    // Upload image to Cloudinary if it exists
    if (req.file) {
      imageUrl = await uploadImageUnsigned(req.file.buffer, req.file.originalname);
    }

    const newItem = {
      status: status || "",
      title: title || "",
      category: category || "",
      description: description || "",
      date: date || "",
      location: location || "",
      contactName: contactName || "",
      contactEmail: contactEmail || "",
      contactPhone: contactPhone || "",
      imageUrl
    };

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

// Start Server
app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
