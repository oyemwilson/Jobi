import React from "react";
import Image from "next/image";
import Link from "next/link";
// internal
import logo from "@/assets/images/logo/logo_03.png";
import logo_2 from "@/assets/images/logo/logo_04.png";
import logo_w from "@/assets/images/logo/logo_06.png";
import shape from "@/assets/images/shape/shape_28.svg";
import { WidgetOne, WidgetThree, WidgetTwo } from "./component/footer-widgets";
import SocialLinks from "./component/social-links";

const FooterOne = ({
	bottom_bg,
	style_2 = false,
	style_3 = false,
}: {
	bottom_bg?: string;
	style_2?: boolean;
	style_3?: boolean;
}) => {
	return (
		<div className={`footer-one ${style_2 ? "bg-two white-version" : ""}`}>
			
			<div
				className={`bottom-footer ${bottom_bg} ${style_2 ? "mt-50 lg-mt-20" : ""}`}
			>
				<div className="container">
					<div className="row align-items-center">
						<div className="col-lg-4 order-lg-3 mb-15">
							<ul className="style-none d-flex order-lg-last justify-content-center justify-content-lg-end social-icon">
								<SocialLinks />
							</ul>
						</div>
						<div className="col-lg-4 order-lg-1 mb-15">
							<ul className="d-flex style-none bottom-nav justify-content-center justify-content-lg-start">
								<li>
									<Link href='/contact'>Privacy & Terms.</Link>
								</li>
								<li>
									<Link href='/contact'> Contact Us</Link>
								</li>
							</ul>
						</div>
						<div className="col-lg-4 order-lg-2">
							<p className={`text-center mb-15 ${style_2 ? "text-white" : ""}`}>
								Copyright @{new Date().getFullYear()} Cureisme inc.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default FooterOne;
