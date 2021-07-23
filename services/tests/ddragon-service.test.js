const ddragonService = require('../ddragon-service');

describe('Data Dragon Champion Retrieval', () => {
    test('I should be able to pull a list of champions from Riots ddragon endpoint.', () => {
        return ddragonService.getChampions().then((champions) => {
            expect(Array.isArray(champions)).toBeTruthy();
            expect(champions.length).toBeGreaterThan(0)
        });
    })
})

describe('Data Dragon Version Retrieval', () => {
    test('I should be able to pull the latest version available for ddragon.', () => {
        return ddragonService.getLatestVersion().then((version) => {
            expect(version).toBeTruthy();
            expect(version).toMatch(/.*\..*\..*/)
        })
    })
})
