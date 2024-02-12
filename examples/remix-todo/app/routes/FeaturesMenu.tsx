import { useEffect, useRef, useState } from "react";
import type { Feature } from "./ElaborateTodo";
import { upArrow } from "./icons";

function FeaturesMenu({
	features,
	toggleFeature,
	featuresMenu,
	toggleFeaturesMenu,
}: {
	features: Feature[];
	toggleFeature: (index: number) => void;
	featuresMenu: boolean;
	toggleFeaturesMenu: () => void;
}) {
	const [subMenu, setSubMenu] = useState(false);
	const [activeIndex, setActiveIndex] = useState(0);

	useEffect(() => {
		if (!featuresMenu) setSubMenu(false);
	}, [featuresMenu]);

	return (
		<div
			className={`absolute bottom-0 w-full transition-all ${
				featuresMenu
					? subMenu
						? "h-44 bg-ctp-surface0 rounded-t-xl"
						: "h-24"
					: "h-0"
			}`}
		>
			<div className="relative w-full h-full">
				<div className="absolute w-full flex justify-center -top-16 h-0">
					<button
						className={`relative mx-auto font-medium text-lg flex flex-col w-24 items-center `}
						onClick={toggleFeaturesMenu}
					>
						<PopupButton featuresMenu={featuresMenu} />
					</button>
				</div>
				<div
					className={`bg-ctp-surface0 transition-all rounded-t-xl flex justify-center gap-4 ${
						subMenu ? "h-20" : "h-0"
					}`}
				>
					{features[activeIndex].subFeatures?.map((subFeature, i) => {
						if (subMenu)
							return (
								<div className="p-2 h-full flex" key={i}>
									<FeatureButton
										feature={features[subFeature]}
										toggleFeature={toggleFeature}
										index={activeIndex + i + 1}
										setSubMenu={(s: boolean) => {}}
										setActiveIndex={(i: number) => {}}
									/>
								</div>
							);
					})}
				</div>
				<div className=" w-full rounded-t-xl flex-1 h-24 overflow-hidden">
					<div className="p-4 bg-ctp-surface1 w-full overflow-x-auto overflow-y-hidden h-full flex justify-between">
						<div className="w-fit flex gap-2 flex-nowrap justify-between flex-1 text-sm md:text-base">
							{features.map((feature, i) => {
								if (!feature.isSub)
									return (
										<FeatureButton
											feature={feature}
											toggleFeature={toggleFeature}
											index={i}
											key={i}
											setSubMenu={(state: boolean) =>
												setSubMenu(state)
											}
											setActiveIndex={(index: number) =>
												setActiveIndex(index)
											}
										/>
									);
							})}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default FeaturesMenu;

function PopupButton({ featuresMenu }: { featuresMenu: boolean }) {
	return (
		<>
			<div
				className={`mx-auto w-fit transition-transform duration-500 scale-x-150 ${
					featuresMenu ? " translate-y-8 rotate-180" : "translate-y-2"
				}`}
			>
				{upArrow}
			</div>
			<div className="absolute">
				<p
					className={` translate-y-2 transition-opacity duration-200 ${
						featuresMenu ? " opacity-100" : " opacity-0"
					}`}
				>
					close
				</p>
				<p
					className={` transition-opacity duration-200 ${
						featuresMenu ? " opacity-0" : " opacity-100"
					}`}
				>
					features
				</p>
			</div>
		</>
	);
}

function FeatureButton({
	feature,
	toggleFeature,
	index,
	setSubMenu,
	setActiveIndex,
}: {
	feature: Feature;
	toggleFeature: (index: number) => void;
	index: number;
	setSubMenu: (state: boolean) => void;
	setActiveIndex: (index: number) => void;
}) {
	const [hoverCard, setHoverCard] = useState(false);
	const [hoverCardPos, setHoverCardPos] = useState({ x: 0, y: 0 });
	const popupRef = useRef(null);
	const buttonRef = useRef(null);

	useEffect(() => {
		if (popupRef.current && buttonRef.current) {
			const popup = popupRef.current as HTMLElement;
			const button = buttonRef.current as HTMLElement;
			const pos = { x: 0, y: 0 };
			pos.x = button.getBoundingClientRect().left - 16;
			pos.y =
				button.getBoundingClientRect().top -
				popup.getBoundingClientRect().height;
			setHoverCardPos(pos);
		}
	}, [hoverCard]);

	return (
		<div className="group">
			<button
				ref={buttonRef}
				className={`px-2 flex items-center text-ctp-text rounded-md border-2 duration-200 transition-all w-24 h-full peer ${
					feature.active
						? " bg-ctp-blue font-semibold text-white border-white ctp-latte"
						: "bg-ctp-surface2 border-transparent"
				}`}
				onClick={() => {
					toggleFeature(index);
					setActiveIndex(index);
					if (feature.subFeatures) setSubMenu(true);
					else setSubMenu(false);
				}}
				onPointerEnter={() => setHoverCard(true)}
				onPointerLeave={() => setHoverCard(false)}
			>
				{feature.name}
			</button>
			<div
				ref={popupRef}
				style={{ top: hoverCardPos.y, left: hoverCardPos.x }}
				className={`fixed z-50 transition-opacity text-wrap w-32 pointer-events-none text-center text-xs md:text-sm ${
					hoverCard ? "opacity-100" : "opacity-0"
				}`}
			>
				<p className="bg-ctp-base shadow-lg p-2 rounded-lg">
					{feature.description}
				</p>
				<div className=" mx-auto rotate-45 bg-ctp-base w-3 h-3 -translate-y-[6px]" />
			</div>
		</div>
	);
}
