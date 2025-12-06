function Footer() {
  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-44 py-20 overflow-hidden flex flex-col gap-4 ">
      <div className="flex gap-4">
        <div className="flex-2 flex flex-col text-xs gap-4 text-gray-400">
          <img src="src/assets/logo.svg" alt="Logo" className="w-25" />
          <p className="max-w-md">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Assumenda
            alias eius hic voluptatum cum vitae pariatur fugit totam nesciunt,
            repudiandae
          </p>
          <div className="flex gap-4">
            <img
              src="src/assets/googlePlay.svg"
              alt="Google Play"
              className="w-20"
            />
            <img
              src="src/assets/appStore.svg"
              alt="App Store"
              className="w-20"
            />
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-6">
          <h3 className="text-sm text-gray-300 font-semibold">Company</h3>
          <ul className="flex flex-col gap-2 text-xs text-gray-400">
            <li>Home</li>
            <li>About Us</li>
            <li>Contact Us</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
        <div className="flex  flex-col gap-6">
          <h3 className="text-sm text-gray-300 font-semibold">Get in touch</h3>
          <ul className="flex flex-col gap-2 text-xs text-gray-400">
            <li>+123 456 7890</li>
            <li>info@example.com</li>
          </ul>
        </div>
      </div>

      <hr className="mt-4 text-gray-400" />
      <div className="text-gray-400 text flex justify-center text-xs mt-2">
        <p>Copyright 2026 © Sanjay. All rights reserved.</p>
      </div>
    </div>
  );
}

export default Footer;
