<?php

namespace Treetop1500\EasyadminDragndropSortBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Annotation\Route;
use ReflectionClass;


/**
 * Class DefaultController
 * @package Treetop1500\EasyadminDragndropSortBundle\Controller
 * @author http://github.com/treetop1500
 */
class DefaultController extends Controller
{
    /**
     * Resorts an item using it's doctrine sortable property
     *
     * @Route("/sort/{entityClass}/{id}/{position}", name="easyadmin_dragndrop_sort_sort")
     * @param String $entityClass
     * @param Integer $id
     * @param Integer $position
     * @throws NotFoundHttpException
     * @throws \ReflectionException
     * @return Response
     *
     */
    public function sortAction($entityClass, $id, $position)
    {

        $entityClassNameArray = explode("\\", $entityClass);
        $entityClassName = end($entityClassNameArray);
        try {
            $rc = new ReflectionClass($entityClass);
        } catch (\ReflectionException $error) {
            throw new \ReflectionException("The class name ". $entityClass ."  cannot be reflected.");
        }

        $em = $this->getDoctrine()->getManager();
        $e = $em->getRepository($rc->getName())->find($id);
        if (is_null($e)) {
            throw new NotFoundHttpException("The entity was not found");
        }
        $e->setPosition($position);
        $em->persist($e);
        $em->flush();
        return $this->redcomposeirectToRoute(
            "easyadmin",
            array(
                "action" => "list",
                "entity" => $entityClassName,
                "sortField" => "position",
                "sortDirection" => "ASC",
            )
        );
    }
}
