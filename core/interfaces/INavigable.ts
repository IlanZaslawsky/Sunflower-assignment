export interface INavigable {
  goto(): Promise<void>;
  getCurrentUrl(): Promise<string>;
}
