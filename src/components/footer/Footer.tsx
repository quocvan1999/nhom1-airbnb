import FooterTabs from "@/components/footer-tabs/FooterTabs";
import { FooterContactType } from "@/types/footer/footerContact.type";
import { contacts, contactsEn } from "@/utils/footer-data/footer.data";
import { useLocale, useTranslations } from "next-intl";
import React from "react";

type Props = {};

const Footer: React.FC<Props> = ({}) => {
  const locale = useLocale();
  const tFooter = useTranslations("Footer");
  return (
    <div className="w-full pb-20 mdc:pb-10 lg:pb-5">
      <div className="max-w-[1280px] mx-auto px-2 py-10 hidden lg:block">
        {/* Title footer */}
        <h1 className="font-bold text-black text-xl mb-1">
          {tFooter("titleH1")}
        </h1>
        {/* Tabs */}
        <div className="hidden lg:block">
          <FooterTabs />
        </div>
      </div>
      {/* Line */}
      <hr className="border-[#DDD] hidden lg:block" />
      {/* Contacts */}
      <div className="max-w-[1280px] mx-auto px-2">
        <div className="flex flex-col gap-10 md:flex-row md:gap-3 py-10">
          {locale === "vi"
            ? contacts.map((item: FooterContactType, index: number) => (
                <div
                  className="w-full md:w-[calc((100%-24px)/3)] text-center md:text-start"
                  key={index}
                >
                  <h1 className="font-bold text-black">{item.title}</h1>
                  {item.contacts.map((content: string, index: number) => (
                    <a
                      href="#"
                      key={index}
                      className="text-custome-gray-200 block mt-2 hover:underline"
                    >
                      {content}
                    </a>
                  ))}
                </div>
              ))
            : contactsEn.map((item: FooterContactType, index: number) => (
                <div
                  className="w-full md:w-[calc((100%-24px)/3)] text-center md:text-start"
                  key={index}
                >
                  <h1 className="font-bold text-black">{item.title}</h1>
                  {item.contacts.map((content: string, index: number) => (
                    <a
                      href="#"
                      key={index}
                      className="text-custome-gray-200 block mt-2 hover:underline"
                    >
                      {content}
                    </a>
                  ))}
                </div>
              ))}
        </div>
        {/* Line */}
        <hr className="border-[#DDD]" />
        {/* End footer */}
        <div className="flex flex-col gap-5 justify-between items-center py-4 lg:flex-row">
          <div className="flex flex-col items-center gap-1 text-custome-gray-200 lg:flex-row lg:gap-3">
            <h1>© 2024 Airbnb, Inc.</h1>
            <ul className="flex items-center gap-3">
              <li className="hover:underline cursor-pointer">
                - {tFooter("titleH2")}
              </li>
              <li className="hover:underline cursor-pointer">
                - {tFooter("titleH3")}
              </li>
              <li className="hover:underline cursor-pointer">
                - {tFooter("titleH4")}
              </li>
            </ul>
          </div>
          <div className="flex items-center gap-5">
            {/* <div className="flex items-center gap-2 hover:underline cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                style={{ fill: "#222" }}
              >
                <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm7.931 9h-2.764a14.67 14.67 0 0 0-1.792-6.243A8.013 8.013 0 0 1 19.931 11zM12.53 4.027c1.035 1.364 2.427 3.78 2.627 6.973H9.03c.139-2.596.994-5.028 2.451-6.974.172-.01.344-.026.519-.026.179 0 .354.016.53.027zm-3.842.7C7.704 6.618 7.136 8.762 7.03 11H4.069a8.013 8.013 0 0 1 4.619-6.273zM4.069 13h2.974c.136 2.379.665 4.478 1.556 6.23A8.01 8.01 0 0 1 4.069 13zm7.381 6.973C10.049 18.275 9.222 15.896 9.041 13h6.113c-.208 2.773-1.117 5.196-2.603 6.972-.182.012-.364.028-.551.028-.186 0-.367-.016-.55-.027zm4.011-.772c.955-1.794 1.538-3.901 1.691-6.201h2.778a8.005 8.005 0 0 1-4.469 6.201z"></path>
              </svg>
            </div> */}
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                style={{ fill: "#222", cursor: "pointer" }}
              >
                <path d="M12.001 2.002c-5.522 0-9.999 4.477-9.999 9.999 0 4.99 3.656 9.126 8.437 9.879v-6.988h-2.54v-2.891h2.54V9.798c0-2.508 1.493-3.891 3.776-3.891 1.094 0 2.24.195 2.24.195v2.459h-1.264c-1.24 0-1.628.772-1.628 1.563v1.875h2.771l-.443 2.891h-2.328v6.988C18.344 21.129 22 16.992 22 12.001c0-5.522-4.477-9.999-9.999-9.999z"></path>
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                style={{ fill: "#222", cursor: "pointer" }}
              >
                <path d="M19.633 7.997c.013.175.013.349.013.523 0 5.325-4.053 11.461-11.46 11.461-2.282 0-4.402-.661-6.186-1.809.324.037.636.05.973.05a8.07 8.07 0 0 0 5.001-1.721 4.036 4.036 0 0 1-3.767-2.793c.249.037.499.062.761.062.361 0 .724-.05 1.061-.137a4.027 4.027 0 0 1-3.23-3.953v-.05c.537.299 1.16.486 1.82.511a4.022 4.022 0 0 1-1.796-3.354c0-.748.199-1.434.548-2.032a11.457 11.457 0 0 0 8.306 4.215c-.062-.3-.1-.611-.1-.923a4.026 4.026 0 0 1 4.028-4.028c1.16 0 2.207.486 2.943 1.272a7.957 7.957 0 0 0 2.556-.973 4.02 4.02 0 0 1-1.771 2.22 8.073 8.073 0 0 0 2.319-.624 8.645 8.645 0 0 1-2.019 2.083z"></path>
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                style={{ fill: "#222", cursor: "pointer" }}
              >
                <path d="M11.999 7.377a4.623 4.623 0 1 0 0 9.248 4.623 4.623 0 0 0 0-9.248zm0 7.627a3.004 3.004 0 1 1 0-6.008 3.004 3.004 0 0 1 0 6.008z"></path>
                <circle cx="16.806" cy="7.207" r="1.078"></circle>
                <path d="M20.533 6.111A4.605 4.605 0 0 0 17.9 3.479a6.606 6.606 0 0 0-2.186-.42c-.963-.042-1.268-.054-3.71-.054s-2.755 0-3.71.054a6.554 6.554 0 0 0-2.184.42 4.6 4.6 0 0 0-2.633 2.632 6.585 6.585 0 0 0-.419 2.186c-.043.962-.056 1.267-.056 3.71 0 2.442 0 2.753.056 3.71.015.748.156 1.486.419 2.187a4.61 4.61 0 0 0 2.634 2.632 6.584 6.584 0 0 0 2.185.45c.963.042 1.268.055 3.71.055s2.755 0 3.71-.055a6.615 6.615 0 0 0 2.186-.419 4.613 4.613 0 0 0 2.633-2.633c.263-.7.404-1.438.419-2.186.043-.962.056-1.267.056-3.71s0-2.753-.056-3.71a6.581 6.581 0 0 0-.421-2.217zm-1.218 9.532a5.043 5.043 0 0 1-.311 1.688 2.987 2.987 0 0 1-1.712 1.711 4.985 4.985 0 0 1-1.67.311c-.95.044-1.218.055-3.654.055-2.438 0-2.687 0-3.655-.055a4.96 4.96 0 0 1-1.669-.311 2.985 2.985 0 0 1-1.719-1.711 5.08 5.08 0 0 1-.311-1.669c-.043-.95-.053-1.218-.053-3.654 0-2.437 0-2.686.053-3.655a5.038 5.038 0 0 1 .311-1.687c.305-.789.93-1.41 1.719-1.712a5.01 5.01 0 0 1 1.669-.311c.951-.043 1.218-.055 3.655-.055s2.687 0 3.654.055a4.96 4.96 0 0 1 1.67.311 2.991 2.991 0 0 1 1.712 1.712 5.08 5.08 0 0 1 .311 1.669c.043.951.054 1.218.054 3.655 0 2.436 0 2.698-.043 3.654h-.011z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
