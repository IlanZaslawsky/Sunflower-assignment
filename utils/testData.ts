import { TestConfig } from '../config/testConfig';

export class TestDataGenerator {
  static generateUniqueEmail(): string {
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    return `test-${timestamp}-${randomSuffix}@automation.local`;
  }

  static generatePassword(): string {
    return TestConfig.testData.defaultPassword;
  }

  static generateTestData() {
    return {
      firstName: 'AutoTest',
      lastName: `User${Date.now()}`,
      email: this.generateUniqueEmail(),
      password: this.generatePassword(),
    };
  }
}
