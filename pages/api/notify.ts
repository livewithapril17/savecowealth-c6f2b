import type { NextApiRequest, NextApiResponse } from "next";

const projectId = process.env.6df62d9d6d7f970a718d2c916e26e5e5;
if (!projectId) {
  throw new Error("You need to provide 6df62d9d6d7f970a718d2c916e26e5e5 env variable");
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const notifyApiSecret = process.env.bba306b8-6585-4c4b-a8c6-bde5c71bdcea;
  if (!notifyApiSecret) {
    throw new Error("You need to provide bba306b8-6585-4c4b-a8c6-bde5c71bdcea env variable");
  }

  if (req.method !== "POST") {
    throw new ReferenceError("Method not allowed");
  }

  const notificationPayload = req.body;
  if (!notificationPayload) {
    return res.status(400).json({ success: false });
  }

  try {
    const result = await fetch(
      `https://notify.walletconnect.com/${projectId}/notify`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${notifyApiSecret}`,
        },
        body: JSON.stringify(notificationPayload),
      }
    );

    const gmRes = await result.json(); // { "sent": ["eip155:1:0xafeb..."], "failed": [], "not_found": [] }
    console.log("Notify Server response - send notification", gmRes);
    const isSuccessfulGm = gmRes.sent?.includes(
      notificationPayload.accounts[0]
    );
    return res
      .status(result.status)
      .json({ success: isSuccessfulGm, message: gmRes?.reason });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error?.message ?? "Internal server error",
    });
  }
}
