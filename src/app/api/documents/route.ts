import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Simulated IPFS service - in production, you'd use actual IPFS
class IPFSService {
  async uploadFile(file: File): Promise<{ hash: string; url: string }> {
    // Simulate IPFS upload - return a mock IPFS hash
    const mockHash = `Qm${Math.random().toString(36).substr(2, 44)}`;
    const mockUrl = `https://ipfs.io/ipfs/${mockHash}`;
    
    // In production, you would:
    // 1. Upload to actual IPFS node
    // 2. Get the real CID back
    // 3. Store the hash in database
    
    return { hash: mockHash, url: mockUrl };
  }

  async getFile(hash: string): Promise<{ exists: boolean; url?: string }> {
    // Simulate IPFS file check
    return { 
      exists: true, 
      url: `https://ipfs.io/ipfs/${hash}` 
    };
  }
}

const ipfsService = new IPFSService();

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const documentType = formData.get('documentType') as string;
    const referenceId = formData.get('referenceId') as string;
    const description = formData.get('description') as string;

    if (!file || !documentType || !referenceId) {
      return NextResponse.json(
        { success: false, error: 'File, document type, and reference ID are required' },
        { status: 400 }
      );
    }

    // Upload to IPFS
    const ipfsResult = await ipfsService.uploadFile(file);

    // Store document metadata in database
    const document = await db.document.create({
      data: {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        ipfsHash: ipfsResult.hash,
        ipfsUrl: ipfsResult.url,
        documentType,
        referenceId,
        description,
        status: 'ACTIVE',
        uploadedBy: 'system', // In production, get from authenticated user
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: document.id,
        fileName: document.fileName,
        ipfsHash: document.ipfsHash,
        ipfsUrl: document.ipfsUrl,
        uploadedAt: document.createdAt,
      },
      message: 'Document uploaded successfully',
    });
  } catch (error) {
    console.error('Document upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload document' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const referenceId = searchParams.get('referenceId');
    const documentType = searchParams.get('documentType');

    const whereClause: any = {};
    if (referenceId) whereClause.referenceId = referenceId;
    if (documentType) whereClause.documentType = documentType;

    const documents = await db.document.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      data: documents,
    });
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch documents' },
      { status: 500 }
    );
  }
}