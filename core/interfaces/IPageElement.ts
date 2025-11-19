export interface IPageElement {
  click(): Promise<void>;
  fill(text: string): Promise<void>;
  getText(): Promise<string>;
  isVisible(): Promise<boolean>;
  waitForVisibility(timeout?: number): Promise<void>;
}
