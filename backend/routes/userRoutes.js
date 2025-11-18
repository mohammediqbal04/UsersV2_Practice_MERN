import express from "express";
import { getusers } from "../server";

const router = express.Router();

router.get("/getAllUsers", getusers);