"use client";
import { useEffect, useState } from "react";
import { parseCookies, setCookie } from "nookies";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// The following cookie name is important because it's Google-predefined for the translation engine purpose
const COOKIE_NAME = "googtrans";

// We should know a predefined nickname of a language and provide its title (the name for displaying)
interface LanguageDescriptor {
  name: string;
  title: string;
}

// The following definition describes typings for JS-based declarations in public/assets/scripts/lang-config.js
declare global {
  namespace globalThis {
    var __GOOGLE_TRANSLATION_CONFIG__: {
      languages: LanguageDescriptor[];
      defaultLanguage: string;
    };
  }
}

const LanguageSwitcher = ({ style }: { style?: string }) => {
  const [currentLanguage, setCurrentLanguage] = useState<string>();
  const [languageConfig, setLanguageConfig] = useState<any>();

  // When the component has initialized, we must activate the translation engine the following way.
  useEffect(() => {
    // 1. Read the cookie
    const cookies = parseCookies();
    const existingLanguageCookieValue = cookies[COOKIE_NAME];

    let languageValue;
    if (existingLanguageCookieValue) {
      // 2. If the cookie is defined, extract a language nickname from there.
      const sp = existingLanguageCookieValue.split("/");
      if (sp.length > 2) {
        languageValue = sp[2];
      }
    }
    // else {
    //   setCookie(null, COOKIE_NAME, "/auto/" + "en", { expires: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) });
    // }
    // 3. If __GOOGLE_TRANSLATION_CONFIG__ is defined and we still not decided about languageValue, let's take a current language from the predefined defaultLanguage below.
    if (global.__GOOGLE_TRANSLATION_CONFIG__ && !languageValue) {
      languageValue = global.__GOOGLE_TRANSLATION_CONFIG__.defaultLanguage;
    }
    if (languageValue) {
      // 4. Set the current language if we have a related decision.
      setCurrentLanguage(languageValue);
    }
    // 5. Set the language config.
    if (global.__GOOGLE_TRANSLATION_CONFIG__) {
      setLanguageConfig(global.__GOOGLE_TRANSLATION_CONFIG__);
    }
  }, []);

  // Don't display anything if current language information is unavailable.
  if (!currentLanguage || !languageConfig) {
    return null;
  }

  // The following function switches the current language
  const switchLanguage = (lang: string) => () => {
    // We just need to set the related cookie and reload the page
    // "/auto/" prefix is Google's definition as far as a cookie name
    setCookie(null, COOKIE_NAME, "/auto/" + lang, { expires: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) });
    window.location.reload();
  };
  return (
    <div className="text-center z-[720] notranslate p-0 m-0 box-border mr-3">
      {/* {languageConfig.languages.map((ld: LanguageDescriptor, i: number) => (
        <>
          {currentLanguage === ld.name || (currentLanguage === "auto" && languageConfig.defaultLanguage === ld) ? (
            <span key={`l_s_${ld}_${i}`} className="mx-[8px] text-orange-300">
              {ld.title}
            </span>
          ) : (
            <a
              key={`l_s_${ld}_${i}`}
              onClick={switchLanguage(ld.name)}
              className="mx-[8px] text-blue-300 cursor-pointer hover:underline"
            >
              {ld.title}
            </a>
          )}
        </>
      ))} */}
      <Select
        defaultValue={`${currentLanguage === "zh-TW" ? currentLanguage : ""}`}
        onValueChange={(v) => {
          switchLanguage(v)();
        }}
      >
        <SelectTrigger className={`notranslate ${style} !font-[560] !text-[1rem] bg-button-blue text-bright-blue mt-1`}>
          <SelectValue
            defaultValue={`${currentLanguage === "zh-TW" ? currentLanguage : "en"}`}
            placeholder={`Language`}
            defaultChecked
          />
        </SelectTrigger>
        <SelectContent className="notranslate z-[710] bg-dark-blue border-2 border-bright-blue">
          <SelectGroup className="bg-dark-blue">
            <SelectLabel>Language</SelectLabel>
            <SelectItem className="cursor-pointer" value="en">
              English
            </SelectItem>
            <SelectItem className="cursor-pointer" value="zh-TW">
              Chinese
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export { LanguageSwitcher, COOKIE_NAME };
