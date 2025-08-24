'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import CardConcepts from '@/components/gamifiedComp/cardconcepts';
import TestPage from '@/components/gamifiedComp/mcqtest';
import { getCards } from '@/lib/actions/card';

export default function Lesson() {
  const { id } = useParams(); // Lesson ID from URL
  const lessonID = parseInt(id[0], 10);
  const [test, setTest] = useState<boolean>(false);

  useEffect(() => {
    const fetchCards = async () => {
      const cards = await getCards(1, 'text');
      console.log(cards);
    }
    fetchCards();
  }, []);

  return (
    <div className='h-full w-full'>
      {
        test ? 
        <TestPage id={lessonID} setTest={setTest} />
        :
        <CardConcepts id={lessonID} setTest={setTest} />
      }
    </div>
  );
}