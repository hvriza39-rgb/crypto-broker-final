import { NextResponse } from 'next/server';
import { getDb } from '../../../../lib/db';
import { ObjectId } from 'mongodb';

// GET: Fetch ALL Pending Deposits
export async function GET(req: Request) {
  try {
    const db = await getDb();
    
    // Join transactions with user details so we know WHO deposited
    const deposits = await db.collection('transactions').aggregate([
      { $match: { type: 'deposit', status: 'Pending' } },
      { $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' }, // Flatten the user array
      { $project: {
          _id: 1,
          amount: 1,
          asset: 1,
          network: 1,
          proof: 1,
          date: 1,
          'user.name': 1,
          'user.email': 1
        }
      }
    ]).toArray();

    return NextResponse.json(deposits);

  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}

// PUT: Approve or Reject Deposit
export async function PUT(req: Request) {
  try {
    const { transactionId, action } = await req.json(); // action = 'approve' or 'reject'
    const db = await getDb();
    const txId = new ObjectId(transactionId);

    // 1. Get the transaction details
    const transaction = await db.collection('transactions').findOne({ _id: txId });
    if (!transaction) return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });

    if (transaction.status !== 'Pending') {
      return NextResponse.json({ error: 'Transaction already processed' }, { status: 400 });
    }

    if (action === 'approve') {
      // A. Update Transaction Status
      await db.collection('transactions').updateOne(
        { _id: txId },
        { $set: { status: 'Completed' } }
      );

      // B. Add Money to User Balance
      await db.collection('users').updateOne(
        { _id: transaction.userId },
        { $inc: { balance: transaction.amount } } // Increment balance
      );

      return NextResponse.json({ success: true, message: 'Deposit Approved' });

    } else if (action === 'reject') {
      // Just update status to Rejected
      await db.collection('transactions').updateOne(
        { _id: txId },
        { $set: { status: 'Rejected' } }
      );
      return NextResponse.json({ success: true, message: 'Deposit Rejected' });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error("Admin Error:", error);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}