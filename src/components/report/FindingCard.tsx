import { severityDotColor, findingCardClass } from '@/lib/report-utils';
import { Lightbulb } from '@/components/Icons';

interface FindingCardProps {
  severity: string;
  title: string;
  description?: string;
  recommendation?: string;
  location?: string;
  badge?: React.ReactNode;
  children?: React.ReactNode;
}

export default function FindingCard({ severity, title, description, recommendation, location, badge, children }: FindingCardProps) {
  const isLow = severity === 'low';

  if (isLow) {
    return (
      <div className={findingCardClass(severity)}>
        <div className="flex items-center gap-2">
          <span className={`inline-block w-2 h-2 rounded-full ${severityDotColor(severity)}`} />
          <span className="text-zinc-300 text-sm">{title}</span>
          {badge}
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className={findingCardClass(severity)}>
      <div className="flex items-center gap-2 mb-1 flex-wrap">
        <span className={`inline-block w-2.5 h-2.5 rounded-full ${severityDotColor(severity)}`} />
        <span className="font-medium text-white">{title}</span>
        {badge}
      </div>
      {description && <p className="text-zinc-300 text-sm mb-1">{description}</p>}
      {location && <p className="text-zinc-500 text-xs font-mono mb-1">Location: {location}</p>}
      {recommendation && (
        <p className="text-zinc-400 text-sm italic flex items-start gap-1 pl-3 border-l-2 border-violet-500/30">
          <Lightbulb className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-violet-400" /> {recommendation}
        </p>
      )}
      {children}
    </div>
  );
}
