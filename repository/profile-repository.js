import { prisma } from "../lib/prisma.js";
import { Profile } from "../models/profiles.js";

export class ProfileRepository {
  constructor() {
    this.prisma = prisma;
  }

  async create(data) {
    const response = await this.prisma.profile.create({
      data: data,
    });

    return response;
  }

  async createMany(data) {
    const response = await this.prisma.profile.createMany({
      data: data,
    });

    return response;
  }

  async getMany(query) {
    const page = query.page || 1;
    const pageSize = query.limit <= 50 && query.limit >= 10 ? query.limit : 10;

    const skip = (page - 1) * pageSize;

    const [data, totalCount] = await this.prisma.$transaction([
      this.prisma.profile.findMany({
        where: {
          gender: query.gender,
          age_group: query.age_group,
          country_id: query.country_id,
          age: {
            gt: query.min_age,
            lt: query.max_age,
          },
          gender_probability: {
            gt: query.min_gender_probability,
            lt: query.max_gender_probability,
          },
        },
        take: pageSize,
        skip: skip,
        orderBy: {
          [query.sort_by || "created_at"]: query.order_by,
        },
      }),
      this.prisma.profile.count({
        where: {
          gender: query.gender,
          age_group: query.age_group,
          country_id: query.country_id,
          age: {
            gt: query.min_age,
            lt: query.max_age,
          },
          gender_probability: {
            gt: query.min_gender_probability,
            lt: query.max_gender_probability,
          },
        },
      }),
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      data,
      totalPages,
      limit: pageSize,
      page,
    };
  }
}
