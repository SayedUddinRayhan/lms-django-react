import Hero from "../../components/Hero";
import ExploreCategories from "../../components/ExploreCategories";
import FeaturedCourses from "../../components/FeaturedCourses";
// import LearnFromExperts from "../../components/LearnFromExperts";
import CTASection from "../../components/CTASection";

const Home = () => {
  return (
    <>
      <Hero />
      <ExploreCategories />
      <FeaturedCourses />
      {/* <LearnFromExperts /> */}
      <CTASection />
    </>
  );
};

export default Home;