import { User } from "@prisma/client";
import express from "express";
import passport from "passport";
import userAbility from "../abilities/user.ability";
import ProfileService from "../services/profile.service";

const router = express.Router();

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const body = req.body;
    const user = req.user;
    const ability = userAbility(user as User);
    const profileService = new ProfileService(ability);

    try {
      const profile = await profileService.create({
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
  }
);

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { limit, page } = req.query;
    const user = req.user;
    const ability = userAbility(user as User);
    const profileService = new ProfileService(ability);

    try {
      const profiles = await profileService.findMany(
        Number(limit),
        Number(page)
      );
      res.status(200).json({ data: profiles, error: null });
    } catch (error: any) {
      res.status(400).json({ data: null, error: error.message });
    }
  }
);

router.get(
  "/byUserId/:userId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const userId = req.params.userId;
    const user = req.user;
    const ability = userAbility(user as User);
    const profileService = new ProfileService(ability);

    try {
      const profile = await profileService.findByUserId(userId);
      res.status(200).json({ data: profile, error: null });
    } catch (error: any) {
      res.status(400).json({ data: null, error: error.message });
    }
  }
);

router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const id = req.params.id;
    const user = req.user;
    const ability = userAbility(user as User);
    const profileService = new ProfileService(ability);

    try {
      const profile = await profileService.findById(id);
      res.status(200).json({ data: profile, error: null });
    } catch (error: any) {
      res.status(400).json({ data: null, error: error.message });
    }
  }
);

router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const id = req.params.id;
    const body = req.body;
    const user = req.user;
    const ability = userAbility(user as User);
    const profileService = new ProfileService(ability);

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
      const profile = await profileService.update(id, {
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
  }
);

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const user = req.user;
    const ability = userAbility(user as User);
    const profileService = new ProfileService(ability);

    try {
      const id = req.params.id;

      const profile = await profileService.remove(id);

      res.status(200).json({ data: profile, error: null });
    } catch (error: any) {
      res.status(400).json({ data: null, error: error.message });
    }
  }
);

export default router;
