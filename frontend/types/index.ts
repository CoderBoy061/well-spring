export type Creator = {
  id?: string;
  creatorId?: string;
  name?: string;
  email?: string;
};

export type AuthResponse = {
  token: string;
  creator: Creator;
};

export type Program = {
  id: string;
  creatorId: string;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Session = {
  id: string;
  creatorId: string;
  programId: string;
  title: string;
  duration: number;
  position: number;
  instructorName: string;
  mediaUrl: string | null;
  tags: string[];
};

export type AuditLog = {
  id: string;
  creatorId: string;
  actorId: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata: Record<string, unknown>;
  createdAt: string;
};

export type ImportResult = {
  successCount?: number;
  failedRows?: Array<{
    row: number;
    reason: string;
  }>;
  message?: string;
};
