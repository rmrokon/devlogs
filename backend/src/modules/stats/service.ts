import { GithubRepository } from "../repositories/model";
import { Activity } from "../activities/model";
import { User } from "../users/model";
import { sequelize } from "../../config/database";
import { Op } from "sequelize";

export class StatsService {
    private static instance: StatsService;

    private constructor() { }

    public static getInstance(): StatsService {
        if (!StatsService.instance) {
            StatsService.instance = new StatsService();
        }
        return StatsService.instance;
    }

    async getDashboardStats(user: User) {
        const userId = user.id;

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const activities = await Activity.findAll({
            include: [{
                model: GithubRepository,
                where: { user_id: userId },
                attributes: []
            }],
            where: {
                type: 'commit',
                date: {
                    [Op.gte]: thirtyDaysAgo
                }
            },
            attributes: [
                [sequelize.fn('DATE', sequelize.col('date')), 'day'],
                [sequelize.fn('SUM', sequelize.col('count')), 'count']
            ],
            group: [sequelize.fn('DATE', sequelize.col('date'))],
            order: [[sequelize.fn('DATE', sequelize.col('date')), 'ASC']],
            raw: true
        });

        const commitTrend = activities.map((a: any) => ({
            date: a.day,
            count: parseInt(a.count)
        }));

        const activityDates = await Activity.findAll({
            include: [{
                model: GithubRepository,
                where: { user_id: userId },
                attributes: []
            }],
            where: { type: 'commit' },
            attributes: [
                [sequelize.fn('DISTINCT', sequelize.col('date')), 'date']
            ],
            order: [['date', 'DESC']],
            raw: true
        });

        const dates = activityDates.map((a: any) => {
            const d = new Date(a.date);
            d.setHours(0, 0, 0, 0);
            return d.getTime();
        });

        let currentStreak = 0;
        let longestStreak = 0;
        let tempStreak = 0;

        if (dates.length > 0) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);

            // Check if user has committed today or yesterday to start current streak
            const mostRecent = dates[0];
            const hasActivityRecently = mostRecent === today.getTime() || mostRecent === yesterday.getTime();

            if (hasActivityRecently) {
                tempStreak = 1;
                for (let i = 0; i < dates.length - 1; i++) {
                    const diff = dates[i] - dates[i + 1];
                    const oneDay = 24 * 60 * 60 * 1000;
                    if (diff === oneDay) {
                        tempStreak++;
                    } else {
                        break;
                    }
                }
                currentStreak = tempStreak;
            }

            let currentLongest = 0;
            let currentTemp = 1;
            for (let i = 0; i < dates.length - 1; i++) {
                const diff = dates[i] - dates[i + 1];
                const oneDay = 24 * 60 * 60 * 1000;
                if (diff === oneDay) {
                    currentTemp++;
                } else {
                    if (currentTemp > currentLongest) currentLongest = currentTemp;
                    currentTemp = 1;
                }
            }
            if (currentTemp > currentLongest) currentLongest = currentTemp;
            longestStreak = currentLongest;
        }

        const repos = await GithubRepository.findAll({
            where: { user_id: userId },
            attributes: ['languages']
        });

        const languages: { language: string, bytes: number }[] = [];
        repos.forEach(repo => {
            if (repo.languages && Array.isArray(repo.languages)) {
                repo.languages.forEach(({ language, bytes }) => {
                    languages.push({ language, bytes });
                });
            }
        });

        const topLanguages = languages
            .sort((a, b) => b.bytes - a.bytes)
            .slice(0, 5)

        const activeRepos = await Activity.findAll({
            include: [{
                model: GithubRepository,
                where: { user_id: userId },
                attributes: ['name', 'url']
            }],
            where: {
                type: 'commit',
                date: { [Op.gte]: thirtyDaysAgo }
            },
            attributes: [
                'repo_id',
                [sequelize.fn('SUM', sequelize.col('count')), 'commits']
            ],
            group: ['repo_id', 'GithubRepository.id', 'GithubRepository.name', 'GithubRepository.url'],
            order: [[sequelize.literal('commits'), 'DESC']],
            limit: 5
        });

        return {
            commitTrend,
            topLanguages,
            activeRepos,
            streak: { current: currentStreak, longest: longestStreak }
        };
    }
}
