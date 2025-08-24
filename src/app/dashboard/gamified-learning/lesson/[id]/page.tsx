'use client';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import CardConcepts from '@/components/gamifiedComp/cardconcepts';
import TestPage from '@/components/gamifiedComp/mcqtest';

export default function Lesson() {
  const { id } = useParams(); // Lesson ID from URL
  const [test, setTest] = useState<boolean>(false);


  return (
    <div className='h-full w-full'>
      {
        test ? 
        <TestPage id={id[0]} setTest={setTest} />
        :
        <CardConcepts id={id[0]} setTest={setTest} />
      }
    </div>
  );
}