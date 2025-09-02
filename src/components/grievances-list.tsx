'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getGrievances, toggleGrievanceLike, addGrievanceComment } from '@/lib/reports';
import type { Grievance } from '@/lib/types';
import Image from 'next/image';
import { format } from 'date-fns';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageCircle, Heart, Flag, Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

function GrievanceSkeleton() {
  return (
    <Card className="w-full mb-6">
      <CardHeader className="pb-4">
        <Skeleton className="h-12 w-12 rounded-full" />
      </CardHeader>
      <Skeleton className="aspect-square w-full" />
      <CardContent className="pt-4">
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </CardContent>
    </Card>
  );
}

function LikeButton({ grievanceId, initialLikes = 0 }: { grievanceId: string; initialLikes: number }) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikes);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const checkLikeStatus = async () => {
      try {
        const session = await supabase.auth.getSession();
        const userId = session.data.session?.user?.id;
        
        if (!userId) return;

        const { data } = await supabase
          .from('grievance_likes')
          .select('id')
          .eq('grievance_id', grievanceId)
          .eq('user_id', userId)
          .single();
        
        setIsLiked(!!data);
      } catch (error) {
        console.error('Error checking like status:', error);
      }
    };
    
    checkLikeStatus();
  }, [grievanceId]);

  const handleLike = async () => {
    if (isUpdating) return;
    
    setIsUpdating(true);
    const optimisticLikeCount = isLiked ? likeCount - 1 : likeCount + 1;
    const optimisticIsLiked = !isLiked;
    
    // Optimistic update
    setLikeCount(optimisticLikeCount);
    setIsLiked(optimisticIsLiked);
    
    try {
      const result = await toggleGrievanceLike(grievanceId);
      if (!result.success) {
        // Revert on failure
        setLikeCount(likeCount);
        setIsLiked(isLiked);
      }
    } catch (err) {
      console.error('Error updating like:', err);
      // Revert on error
      setLikeCount(likeCount);
      setIsLiked(isLiked);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex items-center gap-1.5">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleLike}
        className={isLiked ? "text-red-500 hover:text-red-600" : ""}
        disabled={isUpdating}
      >
        <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
      </Button>
      <span className="text-sm text-muted-foreground">{likeCount}</span>
    </div>
  );
}

function GrievanceCard({ grievance }: { grievance: Grievance }) {
  const [isImageExpanded, setIsImageExpanded] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmittingComment) return;

    setIsSubmittingComment(true);
    try {
      const comment = await addGrievanceComment(grievance.id, newComment.trim());
      grievance.comments = [...(grievance.comments || []), comment];
      setNewComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  return (
    <Card className="w-full mb-6 overflow-hidden">
      <CardHeader className="pb-4 flex flex-row items-center space-x-4">
        <Avatar>
          <AvatarFallback className="bg-primary/10 text-primary">
            {grievance.title.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <CardTitle className="text-base">{grievance.title}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {format(new Date(grievance.createdAt), 'MMMM d, yyyy')}
          </p>
        </div>
      </CardHeader>

      {grievance.photoDataUri && (
        <Dialog open={isImageExpanded} onOpenChange={setIsImageExpanded}>
          <DialogTrigger asChild>
            <div className="relative w-full aspect-square bg-muted cursor-zoom-in">
              <Image
                src={grievance.photoDataUri}
                alt="Supporting evidence"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
              />
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-4xl w-full h-[80vh]">
            <DialogHeader>
              <DialogTitle>{grievance.title}</DialogTitle>
            </DialogHeader>
            <div className="relative w-full h-full bg-muted">
              <Image
                src={grievance.photoDataUri}
                alt="Supporting evidence"
                fill
                sizes="(max-width: 1200px) 100vw, 1200px"
                className="object-contain"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}

      <CardContent className="pt-4">
        <p className="whitespace-pre-wrap line-clamp-3 hover:line-clamp-none transition-all cursor-pointer">
          {grievance.description}
        </p>
      </CardContent>

      <CardFooter className="flex flex-col py-4 gap-4">
        <div className="flex justify-between w-full">
          <div className="flex space-x-2">
            <LikeButton grievanceId={grievance.id} initialLikes={grievance.likes || 0} />
            <div className="flex items-center gap-1.5">
              <Button variant="ghost" size="sm" onClick={() => setIsCommenting(prev => !prev)}>
                <MessageCircle className="h-5 w-5" />
              </Button>
              <span className="text-sm text-muted-foreground">{(grievance.comments || []).length}</span>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-destructive">
            <Flag className="h-5 w-5" />
          </Button>
        </div>
        
        {isCommenting && (
          <div className="w-full space-y-4">
            <div className="space-y-2">
              {grievance.comments?.map((comment, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="text-xs">AN</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm whitespace-pre-wrap">{comment.text}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(comment.createdAt), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={handleCommentSubmit} className="flex gap-2">
              <Textarea
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 min-h-[2.5rem] h-[2.5rem] resize-none"
              />
              <Button 
                type="submit" 
                size="sm"
                disabled={!newComment.trim() || isSubmittingComment}
              >
                {isSubmittingComment ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Post'
                )}
              </Button>
            </form>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}

export function GrievancesList() {
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGrievances = async () => {
      try {
        const data = await getGrievances();
        setGrievances(data);
      } catch (err) {
        setError('Failed to load grievances. Please try again later.');
        console.error('Error loading grievances:', err);
      } finally {
        setLoading(false);
      }
    };

    loadGrievances();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <GrievanceSkeleton />
        <GrievanceSkeleton />
        <GrievanceSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="w-full bg-destructive/10">
        <CardContent className="p-6">
          <p className="text-destructive">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (grievances.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">No grievances have been submitted yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {grievances.map((grievance) => (
        <GrievanceCard key={grievance.id} grievance={grievance} />
      ))}
    </div>
  );
}
