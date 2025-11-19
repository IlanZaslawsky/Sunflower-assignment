export class TestDataGenerator {
  static generateUniqueEmail(): string {
    const uuid = this.generateUUID();
    return `test-${uuid}@automation.local`;
  }

  static generatePassword(): string {
    return 'TempPass123!@#';
  }

  static generateTestData() {
    return {
      firstName: 'AutoTest',
      lastName: `User${Date.now()}`,
      email: this.generateUniqueEmail(),
      password: this.generatePassword(),
    };
  }

  private static generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}
