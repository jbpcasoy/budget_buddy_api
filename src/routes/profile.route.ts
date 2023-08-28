import express from "express";
import ProfileService from "../services/profile.service";

const router = express.Router();

router.post("/", async (req, res) => {
  const body = req.body;
  try {
    const profile = await ProfileService.create({
      barangay: body.barangay,
      city: body.city,
      country: body.country,
      firstName: body.firstName,
      lastName: body.lastName,
      province: body.province,
      street: body.street,
      zipCode: body.zipCode,
      middleName: body.middleName,
      User: {
        connect: {
          id: body.userId,
        },
      },
    });
    res.status(201).json({ data: profile, error: null });
  } catch (error: any) {
    res.status(400).json({ data: null, error: error.message });
  }
});

router.get("/", async (req, res) => {
  const { limit, page } = req.query;
  try {
    const profiles = await ProfileService.findMany(Number(limit), Number(page));
    res.status(200).json({ data: profiles, error: null });
  } catch (error: any) {
    res.status(400).json({ data: null, error: error.message });
  }
});

router.get("/byUserId/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const profile = await ProfileService.findByUserId(userId);
    res.status(200).json({ data: profile, error: null });
  } catch (error: any) {
    res.status(400).json({ data: null, error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const profile = await ProfileService.findById(id);
    res.status(200).json({ data: profile, error: null });
  } catch (error: any) {
    res.status(400).json({ data: null, error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const body = req.body;
  const {
    barangay,
    city,
    country,
    firstName,
    lastName,
    middleName,
    province,
    street,
    zipCode,
  } = body;
  try {
    const profile = await ProfileService.update(id, {
      barangay,
      city,
      country,
      firstName,
      lastName,
      middleName,
      province,
      street,
      zipCode,
    });
    res.status(200).json({ data: profile, error: null });
  } catch (error: any) {
    res.status(400).json({ data: null, error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const profile = await ProfileService.remove(id);

    res.status(200).json({ data: profile, error: null });
  } catch (error: any) {
    res.status(400).json({ data: null, error: error.message });
  }
});

export default router;
