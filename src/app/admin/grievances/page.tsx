'use client';

import { useEffect, useState } from 'react';
import { getGrievances, deleteGrievance, addGrievanceComment, deleteGrievanceComment } from '@/lib/reports';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { formatDistanceToNow } from 'date-fns';
import type { Grievance } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Trash2, MessageSquare, Eye } from 'lucide-react';
import Image from 'next/image';

export default function AdminGrievancesPage() {
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [selectedGrievance, setSelectedGrievance] = useState<Grievance | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const loadGrievances = async () => {
    try {
      const data = await getGrievances();
      setGrievances(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load grievances',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    loadGrievances();
  }, []);

  const handleDelete = async (grievance: Grievance) => {
    try {
      await deleteGrievance(grievance.id);
      setGrievances(grievances.filter(g => g.id !== grievance.id));
      setIsDeleteDialogOpen(false);
      toast({
        description: 'Grievance deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete grievance',
        variant: 'destructive',
      });
    }
  };

  const handleAddComment = async (grievanceId: string) => {
    if (!newComment.trim()) return;
    
    setIsLoading(true);
    try {
      const comment = await addGrievanceComment(grievanceId, newComment);
      setGrievances(grievances.map(g => {
        if (g.id === grievanceId) {
          return {
            ...g,
            comments: [...g.comments, comment],
          };
        }
        return g;
      }));
      setNewComment('');
      toast({
        description: 'Comment added successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add comment',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteComment = async (grievanceId: string, commentId: string) => {
    try {
      await deleteGrievanceComment(grievanceId, commentId);
      setGrievances(grievances.map(g => {
        if (g.id === grievanceId) {
          return {
            ...g,
            comments: g.comments.filter(c => c.id !== commentId),
          };
        }
        return g;
      }));
      toast({
        description: 'Comment deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete comment',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Grievances</h1>
      </div>

      <div className="grid gap-6">
        {grievances.map((grievance) => (
          <Card key={grievance.id} className="overflow-hidden">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-xl">{grievance.title}</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setSelectedGrievance(grievance);
                      setIsViewDialogOpen(true);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => {
                      setSelectedGrievance(grievance);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Posted {formatDistanceToNow(new Date(grievance.createdAt), { addSuffix: true })}
              </p>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">{grievance.description}</p>
              {grievance.photoDataUri && (
                <div className="relative aspect-video w-full mb-4 rounded-md overflow-hidden">
                  <Image
                    src={grievance.photoDataUri}
                    alt="Grievance evidence"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {grievance.comments?.length || 0} Comments
                  </span>
                </div>
                <ScrollArea className="h-[200px] rounded-md border p-4">
                  {grievance.comments?.map((comment) => (
                    <div key={comment.id} className="flex items-start justify-between gap-2 py-2">
                      <div>
                        <p className="text-sm">{comment.text}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteComment(grievance.id, comment.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </ScrollArea>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex w-full gap-2">
                <Textarea
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <Button
                  onClick={() => handleAddComment(grievance.id)}
                  disabled={isLoading || !newComment.trim()}
                >
                  Post
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Grievance</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this grievance? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedGrievance && handleDelete(selectedGrievance)}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Grievance Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedGrievance?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>{selectedGrievance?.description}</p>
            {selectedGrievance?.photoDataUri && (
              <div className="relative aspect-video w-full rounded-md overflow-hidden">
                <Image
                  src={selectedGrievance.photoDataUri}
                  alt="Grievance evidence"
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <Separator />
            <div className="space-y-2">
              <h3 className="font-semibold">Comments</h3>
              {selectedGrievance?.comments?.map((comment) => (
                <Alert key={comment.id}>
                  <AlertDescription>{comment.text}</AlertDescription>
                </Alert>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
