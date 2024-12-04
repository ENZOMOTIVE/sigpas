// global.d.ts
declare global {
    interface Window {
      ethereum?: any; // Or use a more specific type if needed (e.g., MetaMask)
    }
  }
  
  // Make sure to export an empty object so TypeScript treats this as a module
  export {};
  