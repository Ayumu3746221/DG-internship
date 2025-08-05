export const GraphPlaceholder = ({ activeTab, selectedApp, selectedPeriod }) => {
  const getGraphContent = () => {
    if (!selectedApp || !selectedPeriod) {
      return {
        title: 'データ分析ダッシュボード',
        message: 'アプリケーションと期間を選択してグラフを表示',
        icon: 'chart',
        color: 'gray'
      };
    }

    switch (activeTab) {
      case 'ltv':
        return {
          title: 'セグメント別平均LTV推移',
          message: 'ライト・ミドル・ヘビー課金者のLTV推移を可視化',
          icon: 'trending',
          color: 'blue'
        };
      case 'revenue':
        return {
          title: '曜日・時間別売上推移',
          message: '曜日・時間に応じた合計課金額の推移を分析',
          icon: 'calendar',
          color: 'green'
        };
      case 'demographics':
        return {
          title: '顧客属性分析',
          message: '性別・年齢・都道府県の割合を可視化',
          icon: 'users',
          color: 'purple'
        };
      default:
        return {
          title: 'データ分析',
          message: '分析タイプを選択してください',
          icon: 'chart',
          color: 'gray'
        };
    }
  };

  const { title, message, icon, color } = getGraphContent();

  const getIcon = () => {
    switch (icon) {
      case 'trending':
        return (
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        );
      case 'calendar':
        return (
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'users':
        return (
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
    }
  };

  const getColorClasses = () => {
    switch (color) {
      case 'blue':
        return {
          bg: 'bg-gradient-to-br from-blue-50 to-blue-100',
          icon: 'text-blue-500',
          title: 'text-blue-900',
          message: 'text-blue-700',
          accent: 'bg-blue-500'
        };
      case 'green':
        return {
          bg: 'bg-gradient-to-br from-green-50 to-green-100',
          icon: 'text-green-500',
          title: 'text-green-900',
          message: 'text-green-700',
          accent: 'bg-green-500'
        };
      case 'purple':
        return {
          bg: 'bg-gradient-to-br from-purple-50 to-purple-100',
          icon: 'text-purple-500',
          title: 'text-purple-900',
          message: 'text-purple-700',
          accent: 'bg-purple-500'
        };
      default:
        return {
          bg: 'bg-gradient-to-br from-gray-50 to-gray-100',
          icon: 'text-gray-400',
          title: 'text-gray-800',
          message: 'text-gray-600',
          accent: 'bg-gray-400'
        };
    }
  };

  const colorClasses = getColorClasses();

  return (
    <div className={`${colorClasses.bg} rounded-2xl shadow-lg border border-white/50 backdrop-blur-sm p-12 h-full flex flex-col justify-center`}>
      <div className="text-center">
        <div className={`w-24 h-24 mx-auto mb-6 bg-white/80 rounded-2xl flex items-center justify-center shadow-lg ${colorClasses.icon}`}>
          {getIcon()}
        </div>
        
        <h3 className={`text-2xl font-bold mb-4 ${colorClasses.title}`}>
          {title}
        </h3>
        
        <p className={`text-lg mb-8 ${colorClasses.message} leading-relaxed`}>
          {message}
        </p>
        
        {selectedApp && selectedPeriod && (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md">
            <div className="flex items-center justify-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${colorClasses.accent}`}></div>
                <span className="font-semibold text-gray-800">アプリ:</span>
                <span className="text-gray-700">{selectedApp}</span>
              </div>
              <div className="w-px h-6 bg-gray-300"></div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${colorClasses.accent}`}></div>
                <span className="font-semibold text-gray-800">期間:</span>
                <span className="text-gray-700">
                  {selectedPeriod === '1week' ? '1週間' : selectedPeriod === '1month' ? '1ヶ月' : '1年'}
                </span>
              </div>
            </div>
          </div>
        )}
        
        {!selectedApp || !selectedPeriod ? (
          <div className="mt-8">
            <div className="flex justify-center space-x-2">
              <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        ) : (
          <div className="mt-8">
            <div className="inline-flex items-center px-4 py-2 bg-white/60 rounded-full text-sm text-gray-600">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              グラフ描画準備中...
            </div>
          </div>
        )}
      </div>
    </div>
  );
};