import { Router } from "express";
import { Joi } from "express-validation";

import { asyncHandler, methodNotAllowed, validated } from "../utils/middleware";

import * as service from "./bookmarksService";

const router = Router();

router
	.route("/")
	.get(
		asyncHandler(async (req, res) => {
			if (!req.user) {
				return res.sendStatus(403);
			}

			// TODO implement paging
			res.send({
				resources: await service.findAll(req.user.id),
			});
		})
	)
	.post(
		validated({
			body: Joi.object({
				resource: Joi.string().required(),
			}).unknown(),
		}),
		asyncHandler(async (req, res) => {
			const { resource } = req.body;
			if (!req.user) {
				return res.sendStatus(403);
			}

			await service.add(req.user.id, resource);
			res.sendStatus(201);
		})
	)
	.delete(
		validated({
			query: Joi.object({
				resource: Joi.string().required(),
			}),
		}),
		asyncHandler(async (req, res) => {
			const { resource } = req.query;
			if (!req.user) {
				return res.sendStatus(403);
			}

			await service.remove(req.user.id, resource);
			res.sendStatus(200);
		})
	)
	.all(methodNotAllowed);

export default router;
