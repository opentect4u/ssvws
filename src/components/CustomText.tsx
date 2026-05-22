import React from 'react';
import { Text, TextProps } from 'react-native';
import { COLORS, FONTS } from '../config/theme';

interface CustomTextProps extends TextProps {
    h1?: boolean;
    h2?: boolean;
    h3?: boolean;
    h4?: boolean;

    body1?: boolean;
    body2?: boolean;
    body3?: boolean;
    body4?: boolean;
    body5?: boolean;
    body6?: boolean;

    bold?: boolean;
    semiBold?: boolean;
    medium?: boolean;
    light?: boolean;

    color?: string;
    size?: number;

    align?: 'left' | 'center' | 'right' | 'justify';
}

const CustomText: React.FC<CustomTextProps> = ({
    h1,
    h2,
    h3,
    h4,

    body1,
    body2,
    body3,
    body4,
    body5,
    body6,

    bold,
    semiBold,
    medium,
    light,

    color,
    size,
    align,

    style,
    children,
    ...props
}) => {

    const getStyle = () => {

        if (h1) return FONTS.h1;
        if (h2) return FONTS.h2;
        if (h3) return FONTS.h3;
        if (h4) return FONTS.h4;

        if (body1) return FONTS.body1;
        if (body2) return FONTS.body2;
        if (body3) return FONTS.body3;
        if (body4) return FONTS.body4;
        if (body5) return FONTS.body5;
        if (body6) return FONTS.body6;

        return {};
    };

    const getFontWeight = () => {

        if (light) return '300';

        if (medium) return '500';

        if (semiBold) return '600';

        if (bold) return '700';

        return '400';
    };

    return (
        <Text
            style={[
                getStyle(),

                {
                    color: color || COLORS.text,
                    fontWeight: getFontWeight(),
                },

                size && {
                    fontSize: size,
                },

                align && {
                    textAlign: align,
                },

                style,
            ]}
            {...props}
        >
            {children}
        </Text>
    );
};

export default CustomText;