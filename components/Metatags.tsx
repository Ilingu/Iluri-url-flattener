import Head from "next/head";
import React, { FC } from "react";

interface Props {
  title?: string;
  description?: string;
  image?: string;
}

const MetaTags: FC<Props> = ({
  title = "Iluri",
  description = "URL Flattener/Shortener/Protecter",
}) => (
  <Head>
    <title>{title}</title>
    <meta
      name="viewport"
      content="minimum-scale=1, initial-scale=1, width=device-width"
    />
    <meta name="description" content={description} />
    <link rel="icon" href="/IMG/favicon.ico" />
  </Head>
);

export default MetaTags;
