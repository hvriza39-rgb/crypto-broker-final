import clsx from 'clsx';
export default function Skeleton({ className }:{className?:string}){return <div className={clsx('animate-pulse bg-border rounded', className ?? 'h-4 w-full')} />;}
