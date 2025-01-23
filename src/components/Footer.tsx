// src/components/Footer.tsx

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-4">
      <div className="container mx-auto text-center">
        <a href="https://drpc.org?ref=bf7458" target="_blank" rel="noopener noreferrer">
          <img
            style={{ width: '218px', height: '54px' }}
            src="https://drpc.org/images/external/powered-by-drpc-light.svg"
            alt="Powered by dRPC"
          />
        </a>
        <p className="mt-2 text-sm">
          © {new Date().getFullYear()} Your Application Name. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
