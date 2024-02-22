import { NextRequest, NextResponse } from "next/server";
import { client } from "../route";
import fs from "fs";

// 프로필 이미지 수정
export const PUT = async (request: NextRequest) => {
  try {
    const formData = await request.formData();

    const account = formData.get("account") as string | null;
    const imageFile = formData.get("imageFile") as File | null;

    if (!account || !imageFile) {
      return NextResponse.json(
        {
          message: "Not exist data.",
        },
        {
          status: 400,
        }
      );
    }

    const existUser = await client.user.findUnique({
      where: {
        account,
      },
    });

    if (!existUser) {
      return NextResponse.json(
        {
          message: "Not exist user.",
        },
        {
          status: 400,
        }
      );
    }

    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    fs.writeFileSync(`./public/images/${imageFile.name}`, buffer);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Server Error.",
      },
      {
        status: 500,
      }
    );
  }
};
