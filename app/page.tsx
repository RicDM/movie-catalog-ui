'use client';

import { FeaturedMovies } from "@/components/FeaturedMovies";
import { FeaturedTVShows } from "@/components/FeaturedTVShows";
import { HeroSection } from "@/components/HeroSection";
import { NewReleases } from "@/components/NewReleases";
import styled from 'styled-components';

const MainContent = styled.main`
  width: 100%;
`;

export default function HomePage() {
    return (
        <MainContent>
            <HeroSection />
            <FeaturedMovies />
            <FeaturedTVShows />
            <NewReleases />
        </MainContent>
    );
}
