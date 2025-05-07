import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useBooks } from '../../contexts/BookContext';
import { Comment } from '../../types';
import { Star, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

interface CommentSectionProps {
  bookId: string;
}

const CommentSection = ({ bookId }: CommentSectionProps) => {
  const { user, isAuthenticated } = useAuth();
  const { getCommentsByBookId, addComment, getReadingProgressByUserAndBook } = useBooks();
  const [commentText, setCommentText] = useState('');
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const comments = getCommentsByBookId(bookId);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || !user) {
      toast.error('Vous devez être connecté pour laisser un commentaire.');
      return;
    }
    
    if (commentText.trim() === '') {
      toast.error('Le commentaire ne peut pas être vide.');
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Vérifier si l'utilisateur a commencé à lire le livre
      const progress = await getReadingProgressByUserAndBook(user.id, bookId);
      const hasStartedReading = progress && progress.current_page > 1;
      
      if (!hasStartedReading) {
        toast.error('Vous devez commencer à lire ce livre avant de pouvoir laisser un commentaire.');
        return;
      }
      
      // Ajouter le commentaire
      await addComment({
        user_id: user.id,
        book_id: bookId,
        comment_text: commentText,
        rating,
        is_validated: true,
      });
      
      toast.success('Votre commentaire a été ajouté avec succès.');
      setCommentText('');
      setRating(5);
    } catch (error) {
      console.error('Erreur lors de l\'ajout du commentaire:', error);
      toast.error('Une erreur est survenue lors de l\'ajout du commentaire.');
    } finally {
      setSubmitting(false);
    }
  };

  const StarRating = ({ value }: { value: number }) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < value ? 'text-amber-500 fill-amber-500' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="mt-4">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 font-serif">Avis des lecteurs</h3>
      
      {isAuthenticated ? (
        <form onSubmit={handleCommentSubmit} className="mb-8 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h4 className="text-lg font-semibold mb-3">Laisser un avis</h4>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Votre note
            </label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-6 w-6 ${
                      star <= rating
                        ? 'text-amber-500 fill-amber-500'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
              Votre commentaire
            </label>
            <textarea
              id="comment"
              rows={4}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
              placeholder="Partagez votre avis sur ce livre..."
            ></textarea>
          </div>
          
          <div className="text-sm text-gray-500 mb-4">
            <p>Vous devez avoir commencé à lire ce livre pour pouvoir laisser un commentaire.</p>
            <Link to={`/read/${bookId}`} className="text-amber-600 hover:text-amber-700">
              Commencer la lecture
            </Link>
          </div>
          
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-amber-600 text-white py-2 px-4 rounded-md hover:bg-amber-700 transition-colors duration-200 disabled:bg-amber-400 disabled:cursor-not-allowed"
          >
            {submitting ? 'Envoi en cours...' : 'Envoyer mon avis'}
          </button>
        </form>
      ) : (
        <div className="mb-8 bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
          <p className="text-gray-700 mb-4">Connectez-vous pour laisser un avis sur ce livre.</p>
          <Link
            to="/login"
            className="text-amber-600 hover:text-amber-700 font-medium"
          >
            Se connecter
          </Link>
        </div>
      )}

      {comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <div className="bg-gray-200 p-2 rounded-full mr-3">
                    <User className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{comment.username || 'Lecteur anonyme'}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <StarRating value={comment.rating} />
              </div>
              <p className="text-gray-700">{comment.comment_text}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-700">Pas encore d'avis pour ce livre. Soyez le premier à donner votre opinion!</p>
        </div>
      )}
    </div>
  );
};

export default CommentSection;