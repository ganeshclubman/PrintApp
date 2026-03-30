import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || "3001");

  app.use(express.json());

  // Mock API for Clubman ERP Modules
  app.get("/api/v1/health", (req, res) => {
    res.json({ 
      status: "Healthy", 
      version: "1.0.0",
      timestamp: new Date().toISOString(),
      tenant: req.headers["x-tenant-id"] || "Default"
    });
  });

  // Sample Membership API
  app.get("/api/v1/membership/members", (req, res) => {
    res.json({
      items: [
        { id: "1", name: "John Doe", memberNo: "M001", status: "Active", category: "Life", email: "john@example.com" },
        { id: "2", name: "Jane Smith", memberNo: "M002", status: "Active", category: "Regular", email: "jane@example.com" },
        { id: "3", name: "Robert Brown", memberNo: "M003", status: "Suspended", category: "Corporate", email: "robert@example.com" },
        { id: "4", name: "Alice Wilson", memberNo: "M004", status: "Active", category: "Sports", email: "alice@example.com" },
        { id: "5", name: "Charlie Davis", memberNo: "M005", status: "Resigned", category: "Life", email: "charlie@example.com" },
      ],
      totalCount: 5,
      pageNumber: 1,
      pageSize: 25
    });
  });

  // Sample Billing API
  app.get("/api/v1/billing/invoices", (req, res) => {
    res.json({
      items: [
        { id: "1", invoiceNo: "INV-2026-001", memberName: "John Doe", amount: 12500, dueDate: "2026-04-15", status: "Paid" },
        { id: "2", invoiceNo: "INV-2026-002", memberName: "Jane Smith", amount: 4500, dueDate: "2026-03-20", status: "Overdue" },
        { id: "3", invoiceNo: "INV-2026-003", memberName: "Robert Brown", amount: 8900, dueDate: "2026-03-25", status: "Paid" },
        { id: "4", invoiceNo: "INV-2026-004", memberName: "Alice Wilson", amount: 5200, dueDate: "2026-03-28", status: "Pending" },
        { id: "5", invoiceNo: "INV-2026-005", memberName: "Charlie Davis", amount: 9800, dueDate: "2026-03-30", status: "Pending" },
      ],
      totalCount: 5,
      pageNumber: 1,
      pageSize: 25
    });
  });

  // Inventory Items
app.get('/api/v1/inventory/items', (req, res) => {
  res.json({
    items: [
      { id: '1', code: 'BEV-001', name: 'Premium Whiskey 750ml', category: 'Beverage', uom: 'Bottle', currentStock: 12, reorderLevel: 15, unitPrice: 4500 },
      { id: '2', code: 'BEV-002', name: 'Draft Beer Keg 50L', category: 'Beverage', uom: 'Keg', currentStock: 5, reorderLevel: 3, unitPrice: 8500 },
      { id: '3', code: 'FNB-001', name: 'Basmati Rice 25kg', category: 'Food', uom: 'Bag', currentStock: 20, reorderLevel: 10, unitPrice: 1800 },
      { id: '4', code: 'FNB-002', name: 'Cooking Oil 15L', category: 'Food', uom: 'Tin', currentStock: 8, reorderLevel: 10, unitPrice: 2200 },
      { id: '5', code: 'HOU-001', name: 'Bath Towels White', category: 'Housekeeping', uom: 'Pcs', currentStock: 150, reorderLevel: 50, unitPrice: 350 },
    ]
  });
});

// Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Clubman ERP Server running on http://localhost:${PORT}`);
  });
}

startServer();
