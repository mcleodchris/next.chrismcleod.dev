import {loadHobbySnapshot, groupHobbyByYear} from '../../config/data/hobby.js';
export default async () => groupHobbyByYear(await loadHobbySnapshot());
