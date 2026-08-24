import { Request, Response } from "express";
import { getJobStatusService } from "../services/job.service.ts";
import { STATUS_CODE } from "../constant/status.code.ts";
import { asyncHandler } from "../utils/asyncHandle.ts";

/**
 * @swagger
 * tags:
 *   name: Jobs
 *   description: Background job status APIs
 */

/**
 * @swagger
 * /jobs/{id}:
 *   get:
 *     summary: Get background job status
 *     description: Returns the current status and metadata of a BullMQ email notification job.
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: BullMQ job ID
 *         example: outbox-1
 *     responses:
 *       200:
 *         description: Job status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     jobId:
 *                       type: string
 *                       example: outbox-1
 *                     status:
 *                       type: string
 *                       enum:
 *                         - pending
 *                         - active
 *                         - completed
 *                         - failed
 *                       example: completed
 *                     attemptsMade:
 *                       type: integer
 *                       example: 1
 *       400:
 *         description: Job ID is required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Job ID is required
 *                 code:
 *                   type: string
 *                   example: JOB_ID_REQUIRED
 *       404:
 *         description: Job not found
 *       500:
 *         description: Internal server error
 */
export const getJobStatusController = asyncHandler(
  async (req: Request, res: Response) => {
    const rawJobId = req.params.id;

    if (!rawJobId || Array.isArray(rawJobId)) {
      return res.status(STATUS_CODE.BAD_REQUEST).json({
        success: false,
        error: "Job ID is required",
        code: "JOB_ID_REQUIRED",
      });
    }

    const job = await getJobStatusService(rawJobId);

    return res.status(STATUS_CODE.SUCCESS).json({
      success: true,
      data: job,
    });
  },
);
