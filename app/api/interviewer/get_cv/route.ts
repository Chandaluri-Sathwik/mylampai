import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib';
import jwt from 'jsonwebtoken';


export const GET = async (req: NextRequest) => {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.substring(7);

    let decodedToken: any;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET as string);
    } catch (error) {
      console.error('JWT verification error:', error);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: userId } = decodedToken;

    const cv = await prisma.cV.findFirst({
      where: { userId },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!cv) {
      return NextResponse.json({ message: 'No CV found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'CV retrieved successfully', cv }, { status: 200 });
  } catch (error) {
    console.error('Error fetching CV:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
};