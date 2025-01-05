import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type StudentInfo = {
  code: string;
  firstName?: string;
  lastName?: string;
  dob?: Date;
  gender?: string;
  majorCode?: string;
  courseCode?: string;
  classId?: number;
};

export type MajorInfo = {
  code: string;
  name: string;
};

export type SchoolYear = {
  id: number;
  code: string;
  year: number;
  name: string;
  startDate: Date;
  endDate: Date;
};

export type SchoolSession = {
  id: number;
  shoolYearCode: number;
  name: string;
  shortName: string;
  startDate: Date;
  endDate: Date;
};

export type BaseContestSchedule = {
  id: number;
  contestId: number;
  contestReviewId: number;
  contestScheduleId: number;
  subjectId: string;
  studentCode: string;
  identityNumber: string;
  contestListId: number;
  isPublished: boolean;
  scoreTypeId: string;
};

export type ContestSchedule = BaseContestSchedule & {
  contestName?: string;
  contestType?: string;
  contestDate?: Date;
  contestTime?: string;
  contestMethodId?: number;
  contestMethod?: string;
  scoreType?: string;
  subjectName?: string;
  credit?: number;
  townName?: string;
  townFloor?: string;
  contestRoom?: string;
  contestLocation?: string;
};

export type SubjectInfo = {
  id: string;
  name: string;
  credit: number;
};

export type ContestReviewInfo = {
  id: number;
  contestTypeId: number;
};

export type ContestTimeInfo = {
  id: number;
  contestMethodId: number;
  name: string;
  startTime: string;
  endTime:string;
}

export type RoomInfo = {
  id: number;
  name: string;
  floor: string;
  townId: number;
  instructionId: number;
}

export type TownInfo = {
  id: number;
  name: string;
}

export type ContestListInfo = {
  id: number;
  contestTimeId: number;
  contestDate: Date;
  roomId?: string;
};