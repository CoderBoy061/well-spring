import { Request, Response } from "express";

import programService from "../services/program.service";

class ProgramController {
  createProgram = async (req: Request, res: Response) => {
    try {
      const { title, description } = req.body;

      const program = await programService.createProgram(
        req.creatorId!,
        title,
        description,
      );

      return res.status(201).json(program);
    } catch (error: any) {
      return res.status(400).json({
        message: error.message,
      });
    }
  };

  getPrograms = async (req: Request, res: Response) => {
    const programs = await programService.getPrograms(req.creatorId!);

    return res.json(programs);
  };

  getProgramById = async (req: Request, res: Response) => {
    const program = await programService.getProgramById(
      req.creatorId!,
      req.params.id as string,
    );

    if (!program) {
      return res.status(404).json({
        message: "Program not found",
      });
    }

    return res.json(program);
  };

  updateProgram = async (req: Request, res: Response) => {
    try {
      const program = await programService.updateProgram(
        req.creatorId!,
        req.params.id as string,
        req.body,
      );

      return res.json(program);
    } catch (error: any) {
      return res.status(404).json({
        message: error.message,
      });
    }
  };

  deleteProgram = async (req: Request, res: Response) => {
    try {
      await programService.deleteProgram(
        req.creatorId!,
        req.params.id as string,
      );

      return res.json({
        success: true,
      });
    } catch (error: any) {
      return res.status(404).json({
        message: error.message,
      });
    }
  };
}

export default new ProgramController();
