import "../../.storybook/styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import type React from "react";
import { useEffect, useState } from "react";
import { datadogRum } from "@datadog/browser-rum";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDb } from "@xmtp/react-sdk";
import { initialize } from "../helpers/i18n";
import { ENVIRONMENT, isAppEnvDemo } from "../helpers";
import Inbox from "../pages/inbox";
import Index from "../pages/index";
import Dm from "../pages/dm";

const AppController: React.FC = () => {
  const [initializedI18n, setInitializedI18n] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const { clearCache } = useDb();
  useEffect(() => {
    const initI18n = async () => {
      await initialize();
      setInitializedI18n(true);
    };
    void initI18n();
  }, []);

  // clear the cache if in demo mode
  useEffect(() => {
    const initAppDemoDb = async () => {
      if (isAppEnvDemo()) {
        if (initializedI18n) {
          await clearCache();
          setInitialized(true);
        }
      } else {
        setInitialized(true);
      }
    };
    void initAppDemoDb();
  }, [clearCache, initializedI18n]);

  useEffect(() => {
    /* The initialization below will only happen 
    on our internal testing url (alpha.xmtp.chat)
    and is used for performance testing purposes.
    This tracking is meant to help surface insights 
    about performance based on team usage, and flag
    any performance degradations before they hit our
    production users. */
    if (window.location.hostname.includes(ENVIRONMENT.ALPHA)) {
      datadogRum.init({
        applicationId: import.meta.env.VITE_DATA_DOG_ID,
        clientToken: import.meta.env.VITE_DATA_DOG_TOKEN,
        site: "datadoghq.com",
        service: "inbox-web",
        env: "prod",
        sessionSampleRate: 100,
        sessionReplaySampleRate: 0,
        trackUserInteractions: false,
        trackResources: true,
        trackLongTasks: true,
        defaultPrivacyLevel: "mask",
      });

      datadogRum.startSessionReplayRecording();
    }
  }, []);

  return initialized ? (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/inbox" element={<Inbox />} />
        <Route path="/dm/:address" element={<Dm />} />
      </Routes>
    </Router>
  ) : null;
};

export default AppController;
