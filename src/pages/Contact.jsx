import { useRef } from "react";
import emailjs from "@emailjs/browser";
import { toast } from "react-hot-toast";

const Contact = () => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm("service_hhc8hfk", "template_xnrguad", form.current, {
        publicKey: "HOLGtalxaoLEAEILh",
      })
      .then(
        () => {
          console.log("SUCCESS!");
          toast.success("Message sent successfully!");
          form.current.reset();
        },
        (error) => {
          console.log("FAILED...", error.text);
          toast.error("Uh oh! Something went wrong.");
          form.current.reset();
        }
      );
  };

  return (
    <>
      <main>
        <div>
          <div className="container">
            <section className="bg-white dark:bg-dark-bg">
              <div className="py-8 lg:py-16 px-4 mx-auto max-w-screen-md">
                <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-center text-gray-900 dark:text-dark-text">
                  Contact Me!
                </h2>
                <p className="mb-8 lg:mb-16 font-light text-center text-gray-800 dark:text-gray-400">
                  I&apos;d love to hear from you. Send me a message and
                  I&apos;ll respond as soon as possible.
                </p>
                <form className="space-y-8" ref={form} onSubmit={sendEmail}>
                  <div>
                    <label
                      htmlFor="name"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      name="user_name"
                      id="name"
                      className="block p-3 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-dark-text dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Your email
                    </label>
                    <input
                      type="email"
                      name="user_email"
                      id="email"
                      className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-dark-text dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="name@flowbite.com"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="subject"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Subject
                    </label>
                    <input
                      type="text"
                      name="user_subject"
                      id="subject"
                      className="block p-3 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-dark-text dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Let us know how we can help you"
                      required
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="message"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Your message
                    </label>
                    <textarea
                      name="message"
                      id="message"
                      rows="6"
                      className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-dark-text dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Leave a comment..."
                      required
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="py-3 px-5 text-sm font-medium text-center rounded-lg bg-primary-700 sm:w-fit hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  >
                    Send message
                  </button>
                </form>
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
};

export default Contact;
