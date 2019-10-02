/* eslint no-console: 0 */

// Add test-specific environment configurations
process.env.APP_ENV = 'test';
process.env.APP_DEBUG = true;
process.env.SENTRY_ENABLED = true;

// Mock the console logs
console.log = jest.fn();
console.debug = jest.fn();
console.info = jest.fn();
console.warn = jest.fn();
console.error = jest.fn();

// Mock Sentry
jest.mock('@sentry/minimal');

// Mock AWS SDK
jest.mock('aws-sdk', () => {
  return {
    SQS: jest.fn().mockImplementation(opts => {
      return {
        sendMessage: jest.fn().mockImplementation(params => {
          return {
            promise: jest.fn().mockImplementation(() => {
              return new Promise(resolve => {
                const response = {
                  ResponseMetadata: {
                    RequestId: 'RequestId',
                  },
                  MD5OfMessageBody: 'MD5OfMessageBody',
                  MessageId: 'MessageId',
                  mocked: {
                    opts,
                    params,
                  },
                };
                resolve(response);
              });
            }),
          };
        }),
      };
    }),
  };
});
