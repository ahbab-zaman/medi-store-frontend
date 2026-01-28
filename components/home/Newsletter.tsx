export default function Newsletter() {
  return (
    <section className="bg-blue-600 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative isolate overflow-hidden bg-black/10 px-6 py-12 shadow-2xl rounded-3xl sm:px-12 md:py-16 lg:flex lg:items-center lg:px-20 lg:py-20">
          <div className="lg:w-0 lg:flex-1">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Sign up for our newsletter
            </h2>
            <p className="mt-4 max-w-3xl text-lg text-blue-100">
              Get the latest updates on new products, health tips, and exclusive
              discounts delivered straight to your inbox.
            </p>
          </div>
          <div className="mt-12 sm:w-full sm:max-w-md lg:mt-0 lg:ml-8 lg:flex-1">
            <form className="flex gap-x-4">
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full min-w-0 flex-auto rounded-full border-0 bg-white/10 px-4 py-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-white sm:text-sm sm:leading-6 placeholder:text-white/60"
                placeholder="Enter your email"
              />
              <button
                type="submit"
                className="flex-none rounded-full bg-white px-8 py-3 text-sm font-semibold text-blue-600 shadow-sm hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Join Now
              </button>
            </form>
            <p className="mt-4 text-sm leading-6 text-blue-100">
              We care about your data. Read our{" "}
              <a
                href="#"
                className="font-semibold text-white hover:text-blue-50"
              >
                privacy&nbsp;policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
