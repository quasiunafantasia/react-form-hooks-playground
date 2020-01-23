const consoleError = console.error;

export const supressAsyncActWarnings = () => {
    beforeAll(() => {
        jest.spyOn(console, 'error').mockImplementation((...args) => {
            if (!args[0].includes('Warning: An update to %s inside a test was not wrapped in act')) {
                consoleError(...args);
            }
        });
    });

    afterAll(() => {
        console.error =consoleError;
    })
};

