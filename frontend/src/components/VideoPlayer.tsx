import React from 'react';
import { useRecoilValue } from 'recoil';
import { shotsState } from '../store';
import { Film, Image, Play } from 'lucide-react';
const VideoPlayer: React.FC = () => {
  const allShots = useRecoilValue(shotsState);
  const withVideo = allShots.filter(s => s.video_url);
  const withImage = allShots.filter(s => s.image_url);
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">视频输出</h3>
      <div className="grid grid-cols-3 gap-4">
        <div className="glass rounded-xl p-4 text-center"><Film size={24} className="mx-auto mb-2 text-manga-accent" /><p className="text-2xl font-bold text-white">{withVideo.length}</p><p className="text-gray-500 text-xs">视频</p></div>
        <div className="glass rounded-xl p-4 text-center"><Image size={24} className="mx-auto mb-2 text-blue-400" /><p className="text-2xl font-bold text-white">{withImage.length}</p><p className="text-gray-500 text-xs">图片</p></div>
      </div>
      <div className="glass rounded-xl p-5"><h4 className="text-white font-medium mb-3">时间线</h4><div className="space-y-2">
        {allShots.map(shot => (
          <div key={shot.id} className="flex items-center gap-3 p-2 bg-manga-bg rounded-lg">
            <div className="w-8 h-8 rounded bg-manga-card flex items-center justify-center">{shot.video_url ? <Play size={14} className="text-green-400" /> : shot.image_url ? <Image size={14} className="text-blue-400" /> : <div className="w-3 h-3 rounded-full bg-gray-600" />}</div>
            <div className="flex-1"><p className="text-white text-sm truncate">{shot.description || `${shot.type} 镜头`}</p></div>
            {shot.video_url && <span className="text-xs text-green-400">完成</span>}
          </div>
        ))}
      </div>{allShots.length === 0 && <p className="text-gray-500 text-sm text-center py-8">暂无镜头</p>}</div>
    </div>
  );
};
export default VideoPlayer;