const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

/** @type {Array<{
 * id: string;
 * status: "lost" | "found";
 * title: string;
 * category: string;
 * description: string;
 * date: string;
 * location: string;
 * contactName: string;
 * contactEmail?: string;
 * contactPhone?: string;
 * imageUrl?: string;
 * }>} */
let items = [
    {
        id: "1",
        status: "lost",
        title: "Black Wallet",
        category: "Accessories",
        description: "Slim black leather wallet with several cards and an ID inside.",
        date: "2026-01-15",
        location: "Main Library Entrance",
        contactName: "Aisha Khan",
        contactEmail: "aisha@example.com",
        contactPhone: "",
        imageUrl: "",
    },
    {
        id: "2",
        status: "found",
        title: "Campus ID Card",
        category: "Documents",
        description: "Student ID card with the name partially visible. Found near cafeteria.",
        date: "2026-01-18",
        location: "Central Cafeteria",
        contactName: "Mohit Verma",
        contactEmail: "",
        contactPhone: "+91 98765 43210",
        imageUrl: "",
    },
    {
        id: "3",
        status: "lost",
        title: "Silver Laptop",
        category: "Electronics",
        description: "13-inch silver laptop in a black sleeve, may have stickers on the lid.",
        date: "2026-01-20",
        location: "Computer Lab 2",
        contactName: "Riya Sharma",
        contactEmail: "riya@example.com",
        contactPhone: "",
        imageUrl: "",
    },
    {
        id: "4",
        status: "found",
        title: "Keychain with Multiple Keys",
        category: "Keys",
        description: "Metal keychain with three keys and a small torch.",
        date: "2026-01-19",
        location: "Parking Area B",
        contactName: "Arjun Patel",
        contactEmail: "arjun@example.com",
        contactPhone: "",
        imageUrl: "",
    },
    {
        id: "5",
        status: "lost",
        title: "Black Hoodie",
        category: "Clothing",
        description: "Plain black hoodie, medium size, no visible logo.",
        date: "2026-01-12",
        location: "Gym Changing Room",
        contactName: "Neha Singh",
        contactEmail: "",
        contactPhone: "+91 91234 56789",
        imageUrl: "",
    },
    {
        id: "6",
        status: "found",
        title: "Earbuds Case",
        category: "Electronics",
        description: "Small wireless earbuds case, black, without earbuds inside.",
        date: "2026-01-10",
        location: "Bus Stop Near Gate 1",
        contactName: "Karan Gupta",
        contactEmail: "karan@example.com",
        contactPhone: "",
        imageUrl: "",
    },
    {
        id: "7",
        status: "lost",
        title: "Notebook with Graph Paper",
        category: "Documents",
        description: "Spiral notebook filled with engineering notes and diagrams.",
        date: "2026-01-09",
        location: "Lecture Hall A3",
        contactName: "Simran Kaur",
        contactEmail: "simran@example.com",
        contactPhone: "",
        imageUrl: "",
    },
    {
        id: "8",
        status: "found",
        title: "Sports Water Bottle",
        category: "Accessories",
        description: "Black and white bottle, reusable, left near the basketball court.",
        date: "2026-01-14",
        location: "Sports Complex",
        contactName: "Dev Mishra",
        contactEmail: "",
        contactPhone: "+91 96543 21098",
        imageUrl: "",
    },
    {
        id: "9",
        status: "lost",
        title: "Scientific Calculator",
        category: "Electronics",
        description: "Standard black scientific calculator with worn-out buttons.",
        date: "2026-01-11",
        location: "Exam Hall C",
        contactName: "Rahul Mehta",
        contactEmail: "rahul@example.com",
        contactPhone: "",
        imageUrl: "",
    },
    {
        id: "10",
        status: "found",
        title: "Black Backpack",
        category: "Accessories",
        description: "Medium-sized backpack with notebooks and pens inside.",
        date: "2026-01-16",
        location: "Canteen Seating Area",
        contactName: "Priya Das",
        contactEmail: "priya@example.com",
        contactPhone: "",
        imageUrl: "",
    },
    {
        id: "11",
        status: "lost",
        title: "Ring with Simple Band",
        category: "Accessories",
        description: "Plain metallic ring, sentimental value.",
        date: "2026-01-08",
        location: "Garden Benches",
        contactName: "Ankit Rao",
        contactEmail: "",
        contactPhone: "+91 99887 66554",
        imageUrl: "",
    },
];

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../Client")));

app.get("/api/items", (req, res) => {
    res.json(items);
});

app.post("/api/items", (req, res) => {
    const {
        status,
        title,
        category,
        description,
        date,
        location,
        contactName,
        contactEmail,
        contactPhone,
        imageUrl,
    } = req.body || {};

    if (
        !status ||
        !title ||
        !category ||
        !description ||
        !date ||
        !location ||
        !contactName
    ) {
        return res.status(400).json({ message: "Missing required fields." });
    }

    if (status !== "lost" && status !== "found") {
        return res.status(400).json({ message: "Invalid status." });
    }

    const newItem = {
        id: String(Date.now()),
        status,
        title: String(title).trim(),
        category: String(category).trim(),
        description: String(description).trim(),
        date: String(date).trim(),
        location: String(location).trim(),
        contactName: String(contactName).trim(),
        contactEmail: String(contactEmail || "").trim(),
        contactPhone: String(contactPhone || "").trim(),
        imageUrl: String(imageUrl || "").trim(),
    };

    items.unshift(newItem);
    return res.status(201).json(newItem);
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../Client/Public/index.html"));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});