import { useState, useEffect, useCallback, useRef } from 'react';
import { getMystery } from '../api/mystery';

/**
 * Polls GET /api/mystery/:id every `interval` ms
 * until status is 'ready' or 'failed'.
 */
export function useMysteryPolling(mysteryId, interval = 3000) {
  const [mystery, setMystery] = useState(null);
  const [error, setError]     = useState(null);
  const timerRef = useRef(null);

  const stop = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (!mysteryId) return;

    const poll = async () => {
      try {
        const { data } = await getMystery(mysteryId);
        setMystery(data);
        if (data.status === 'ready' || data.status === 'failed') {
          stop();
        }
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch mystery.');
        stop();
      }
    };

    poll(); // immediate first call
    timerRef.current = setInterval(poll, interval);
    return stop;
  }, [mysteryId, interval, stop]);

  return { mystery, error };
}
