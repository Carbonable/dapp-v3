interface ProjectsSdg {
  sdgId: string;
  width?: number;
}
export default function SDG({ sdgId, width }: ProjectsSdg) {
 return (
    <a
      href={`https://sdgs.un.org/goals/goal${sdgId}`}
      key={`sdg_image_${sdgId}`}
      target="_blank"
      rel="noreferrer"
    >
      <img
        className="rounded-md hover:brightness-110 transition duration-300"
        alt={`sdg_${sdgId}`}
        src={`https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-${parseInt(sdgId) < 10 ? '0' + sdgId : sdgId}.jpg`}
        width={width}
      />
    </a>
  );
};