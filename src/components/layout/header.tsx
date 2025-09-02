
'use client';

import Link from 'next/link';
import Logo from '@/components/logo';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageSelector } from '@/components/language-selector';
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';

export default function Header() {
  const { t } = useTranslation();
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Logo className="h-6 w-6 text-primary" />
            <span className="font-bold">Jana Awaz</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/report" className="transition-colors hover:text-foreground/80 text-muted-foreground">
              {t('header.fileReport')}
            </Link>
             <Link href="/grievance" className="transition-colors hover:text-foreground/80 text-muted-foreground">
              {t('home.voiceGrievance')}
            </Link>
            <Link href="/grievances" className="transition-colors hover:text-foreground/80 text-muted-foreground">
              {t('header.viewGrievances')}
            </Link>
             <Link href="/track" className="transition-colors hover:text-foreground/80 text-muted-foreground">
              {t('header.trackSubmission')}
            </Link>
          </nav>
        </div>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
                <SheetHeader>
                    <SheetTitle>
                        <Link href="/" className="flex items-center space-x-2">
                            <Logo className="h-6 w-6 text-primary" />
                            <span className="font-bold">Jana Awaz</span>
                        </Link>
                    </SheetTitle>
                </SheetHeader>
              <nav className="flex flex-col space-y-4 text-lg mt-8">
                <SheetClose asChild>
                    <Link href="/report" className="transition-colors hover:text-foreground/80 text-muted-foreground">
                    {t('header.fileReport')}
                    </Link>
                </SheetClose>
                <SheetClose asChild>
                    <Link href="/grievance" className="transition-colors hover:text-foreground/80 text-muted-foreground">
                        {t('home.voiceGrievance')}
                    </Link>
                </SheetClose>
                <SheetClose asChild>
                    <Link href="/grievances" className="transition-colors hover:text-foreground/80 text-muted-foreground">
                    {t('header.viewGrievances')}
                    </Link>
                </SheetClose>
                 <SheetClose asChild>
                    <Link href="/track" className="transition-colors hover:text-foreground/80 text-muted-foreground">
                    {t('header.trackSubmission')}
                    </Link>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
        
        <div className="flex flex-1 items-center justify-end space-x-1">
          <LanguageSelector />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
