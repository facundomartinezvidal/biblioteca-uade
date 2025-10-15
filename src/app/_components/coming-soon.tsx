export const ComingSoon: React.FC<{
  title: string;
  subtitle?: string;
  description?: string;
  icon?: React.ReactNode;
}> = ({ title, subtitle, description, icon }) => {
  return (
    <div className="w-full max-w-md rounded-lg border border-gray-100 bg-white p-6 text-center shadow-sm">
      <div className="bg-berkeley-blue mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full">
        <div className="text-white">{icon}</div>
      </div>
      <h3 className="text-lg font-semibold text-gray-900">
        {title} <span className="text-gray-900">{subtitle}</span>
      </h3>
      <p className="mt-2 text-sm text-gray-600">{description}</p>
    </div>
  );
};
